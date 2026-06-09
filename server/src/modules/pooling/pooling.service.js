import { db } from "../../common/config/db.js";
import { pools, options, votes } from "./pooling.model.js";
import { eq, and, count } from "drizzle-orm";
import users from "../auth/auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import { getIO } from "../../socket.js";

const createPool = async (
  userId,
  question,
  poolOptions,
  anonymousVoting = false,
) => {
  console.log("at create pool service.", poolOptions);

  if (!userId || !question || !poolOptions) {
    throw ApiError.conflict("Something is missing");
  }

  if (poolOptions.length < 2) {
    throw ApiError.conflict("Atleast two options are needed in pool.");
  }

  if (poolOptions.length > 5) {
    throw ApiError.conflict("Maximum 4 options are allowed.");
  }

  const [pool] = await db
    .insert(pools)
    .values({
      userId: userId,
      question: question,
      anonymousVoting: anonymousVoting,
    })
    .returning();

  console.log("pool", pool);

  for (const option of poolOptions) {
    const optionInsert = await db
      .insert(options)
      .values({
        option: option,
        poolId: pool.id,
      })
      .returning();

    console.log("option insert", optionInsert);
  }

  return "poll is created.";
};

const allPools = async (userId) => {
  const userAllPools = await db
    .select()
    .from(pools)
    .where(eq(pools.userId, userId));

  console.log("userAllPools", userAllPools);
  return userAllPools;
};

const deletePool = async (poolId) => {
  if (!poolId) {
    throw ApiError.conflict("pool ID is missing");
  }

  console.log("poolID", poolId);

  // const optionsResponse = await db.delete(options).where(eq(options.poolId,poolId))
  const deleted = await db
    .delete(pools)
    .where(eq(pools.id, poolId))
    .returning();

  if (deleted.length === 0) {
    throw ApiError.badRequest("Pool not found");
  }

  console.log("deleted", deleted);

  return "Pool deleted successfully. ";
};

const getPoll = async (pollId) => {
  if (!pollId) {
    throw ApiError.conflict("pool ID is missing");
  }

  const [poll] = await db
    .select()
    .from(pools)
    .where(eq(pools.id, pollId))
    .limit(1);

  const getOptions = await db
    .select()
    .from(options)
    .where(eq(options.poolId, pollId));

  console.log("poll", poll);

  console.log("options", getOptions);

  return {
    poll,
    getOptions,
  };
};

const createVote = async ({ userId, pollId, optionId, ip }) => {
  if (!pollId || !optionId) {
    throw ApiError.badRequest("missing pollId or optionId");
  }
  console.log("ip", ip);

  const [poll] = await db.select().from(pools).where(eq(pools.id,pollId)).limit(1);

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  if (new Date() > new Date(poll.expiresAt) && poll.isActive) {
    await db.update(pools).set({ isActive: false }).where(eq(pools.id, pollId));

    poll.isActive = false; // update local object
  }

  if (!poll.isActive || poll.isPublished) {
    const result = await getPublicResult(pollId);
    return {
      status: "closed",
      message: "Poll is no longer accepting votes",
      result,
    };
  };

  if (userId) {
    const alreadyVoted = await db
      .select()
      .from(votes)
      .where(and(eq(votes.pollId, pollId), eq(votes.userId, userId)));
    if (alreadyVoted.length !== 0) {
      throw ApiError.badRequest("you already voted for this poll");
    }
  }

  if (!userId && ip) {
    const alreadyVoted = await db
      .select()
      .from(votes)
      .where(and(eq(votes.pollId, pollId), eq(votes.ipAddress, ip)));

    if (alreadyVoted.length !== 0) {
      throw ApiError.badRequest(
        "you already voted for this poll [for anonoumous user]",
      );
    }
  }

  const vote = await db
    .insert(votes)
    .values({
      optionId: optionId,
      pollId: pollId,
      userId: userId || null,
      ipAddress: ip || null,
    })
    .returning();

  console.log("vote", vote);

  if (vote.length === 0) {
    throw ApiError.conflict("failed at voting.");
  }

  return vote[0];
};

const getAnalytics = async (pollId, userId) => {
  console.log("pollID in service", pollId)
  if (!pollId) {
    throw ApiError.conflict("poll ID is missing");
  }

  const [poll] = await db
    .select()
    .from(pools)
    .where(eq(pools.id, pollId))
    .limit(1);

  console.log("pool name", poll);
  // console.log("user id in analytics service", userId);
  // console.log("poll creator id in analytics service", poll.userId);

  if (poll.userId !== userId) {
    throw ApiError.conflict("you are not the creator of this poll");
  }

  const optionsWithCount = await db
    .select({
      optionId: options.id,
      optionText: options.option,
      count: count(votes.id),
    })
    .from(options)
    .leftJoin(votes, eq(votes.optionId, options.id))
    .where(eq(options.poolId, pollId))
    .groupBy(options.id, options.option);

  console.log("optionsWithCount", optionsWithCount);

  return {
    poll,
    totalVotes: optionsWithCount.reduce(
      (acc, curr) => acc + Number(curr.count),
      0,
    ),
    optionsWithCount,
  };
};

const getPublicPoll = async (pollId) => {
  if (!pollId) {
    throw ApiError.conflict("poll ID is missing");
  }

  const [poll] = await db
    .select()
    .from(pools)
    .where(eq(pools.id, pollId))
    .limit(1);

  console.log("poll in public route", poll);

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  if(new Date() > new Date(poll.expiresAt) && poll.isActive ){
    await db.update(pools)
    .set({isActive:false})
    .where(eq(pools.id,pollId));

    poll.isActive = false;
  }

  if (!poll.isActive || poll.isPublished) {
    const result = await getPublicResult(pollId);

    return {
      status: "closed",
      message: "Poll is no longer accepting votes.",
      result
    };
  }

  const pollOptions = await db
    .select()
    .from(options)
    .where(eq(options.poolId, pollId));

  return {
    status: "active",
    poll,
    pollOptions,
  };
};

const publishPoll = async (pollId, userId) => {
  if (!pollId) {
    throw ApiError.conflict("poll ID is missing");
  }
  
  const [updatePoll] = await db
  .update(pools)
  .set({ isActive: false, isPublished: true })
  .where(and(eq(pools.id, pollId)), eq(pools.userId, userId), eq(pools.isPublished, false))
  .returning();
  
  console.log("updatePoll", updatePoll);
  
  if (!updatePoll) {
    throw ApiError.conflict("Poll not found or you are not the creator");
  }
  
  return {
    message: "poll results are now public!",
    poll: updatePoll,
  };
};

const getPublicResult = async(pollId)=> {
  console.log("pollid in service",pollId)
  if (!pollId) {
    throw ApiError.conflict("poll ID is missing");
  }
  
  const [findPoll] = await db.select().from(pools).where(eq(pools.id,pollId)).limit(1);
  
  if(!findPoll){
    throw ApiError.notFound("poll not found!");
    
  }
  
  if(!findPoll.isPublished){
    throw ApiError.conflict("poll results not published yet!");

  };

  const optionsWithCount = await db
    .select({
      optionId: options.id,
      optionText: options.option,
      count: count(votes.id),
    })
    .from(options)
    .leftJoin(votes, eq(votes.optionId, options.id))
    .where(eq(options.poolId, pollId))
    .groupBy(options.id, options.option);

  console.log("optionsWithCount", optionsWithCount);

  return {
    poll:findPoll,
    totalVotes:optionsWithCount.reduce((acc,curr) => acc + Number(curr.count),0),
    optionsWithCount
  }
  
}

export {
  createPool,
  allPools,
  deletePool,
  createVote,
  getPoll,
  getAnalytics,
  getPublicPoll,
  publishPoll,
  getPublicResult,
};
