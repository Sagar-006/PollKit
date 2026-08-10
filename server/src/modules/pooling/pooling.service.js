import { db } from "../../common/config/db.js";
import { pools, options, votes } from "./pooling.model.js";
import { eq, and, count } from "drizzle-orm";
import users from "../auth/auth.model.js";
import ApiError from "../../common/utils/api-error.js";
import { getIO } from "../../socket.js";

const createPool = async (
  userId,
  question,
  pollOptions,
  anonymousVoting = false,
  expiresAt,
) => {


  
  if (!userId || !question || !pollOptions) {
    throw ApiError.conflict("Something is missing in form!");
  }

  if (!expiresAt) {
    throw ApiError.conflict("Invalid date format.");
  }

  const expiresAtDate = new Date(expiresAt);

  if (expiresAtDate <= new Date()) {
    throw ApiError.conflict("Expiry date must be in the future.");
  }

  const validOptions = pollOptions.filter(
    (option) => option.trim() !== ""
  )

  console.log("valid options",validOptions);
  if (validOptions.length < 2) {
    throw ApiError.conflict("Atleast two options are needed in pool.");
  }

  if (validOptions.length > 4) {
    throw ApiError.conflict("Maximum 4 options are allowed.");
  }

  const [pool] = await db
    .insert(pools)
    .values({
      userId: userId,
      question: question,
      expiresAt: expiresAtDate,
      anonymousVoting: anonymousVoting,
    })
    .returning();

  for (const option of validOptions) {
    const optionInsert = await db
      .insert(options)
      .values({
        option: option,
        poolId: pool.id,
      })
      .returning();
  }

  return "poll created successfully!";
};

const allPools = async (userId) => {
  const userAllPools = await db
    .select()
    .from(pools)
    .where(eq(pools.userId, userId));

  return userAllPools;
};

const deletePool = async (poolId) => {
  if (!poolId) {
    throw ApiError.conflict("pool ID is missing");
  }

  const deleted = await db
    .delete(pools)
    .where(eq(pools.id, poolId))
    .returning();

  if (deleted.length === 0) {
    throw ApiError.badRequest("Pool not found");
  }

  return "Pool deleted successfully.";
};

const getPoll = async (pollId) => {
  if (!pollId) {
    throw ApiError.conflict("poll ID is missing");
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

  return {
    poll,
    getOptions,
  };
};

const createVote = async ({ userId, pollId, optionId, ip }) => {

  console.log("at createpoll service");


  if (!pollId || !optionId) {
    throw ApiError.badRequest("missing pollId or optionId");
  }

  const [poll] = await db
    .select()
    .from(pools)
    .where(eq(pools.id, pollId))
    .limit(1);

  if (!poll) {
    throw ApiError.notFound("Poll not found");
  }

  if (!poll.isActive || poll.isPublished) {
    return {
      status: "closed",
      message: "Poll is no longer accepting votes",
      result:null,
    };
  }
  
  if(!poll.anonymousVoting && !userId){
    throw ApiError.unauthorized("You must be logged in to vote.")
  };

   if(userId){
     const [existingVote] = await db
       .select()
       .from(votes)
       .where(and(eq(votes.pollId, pollId), eq(votes.userId, userId)))
       .limit(1);

     if (existingVote) {
       return {
         message: "you already voted",
       };
     }
   }

    if(!userId && poll.anonymousVoting){
      const [existingIp] = await db
        .select()
        .from(votes)
        .where(and(eq(votes.pollId, pollId), eq(votes.ipAddress, ip)))
        .limit(1);

      if (existingIp) {
        return {
          message: "you already voted",
        };
      }
    }

    const vote = await db
      .insert(votes)
      .values({
        optionId: optionId,
        pollId: pollId,
        userId: userId ? userId : null,
        ipAddress: userId ? null : ip || null,
      })
      .returning();


    if (vote.length === 0) {
      throw ApiError.conflict("failed at voting.");
    }
    console.log("after vote complete",vote[0]);

    return {
      result: vote[0],
      message: "vote successfully",
    };
  }

const getAnalytics = async (pollId, userId) => {
  if (!pollId) {
    throw ApiError.conflict("poll ID is missing");
  }

  const [poll] = await db
    .select()
    .from(pools)
    .where(eq(pools.id, pollId))
    .limit(1);


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

      if (!poll) {
        throw ApiError.notFound("Poll not found");
      }

      const now = new Date();
      const expiresAt = new Date(poll.expiresAt);


    if (now >= expiresAt && !poll.isPublished) {
      return {
        status: "pending",
        message: "This poll has expired. Results will appear once published.",
      };
    }



  if (!poll.isActive || poll.isPublished) {
    const result = await getPublicResult(pollId);

    return {
      status: "closed",
      message: "Poll is no longer accepting votes.",
      result,
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
    .where(
      and(
      eq(pools.id, pollId),
      eq(pools.userId, userId),
      eq(pools.isPublished, false)
    ),
    )
    .returning();


  if (!updatePoll) {
    throw ApiError.conflict("Poll not found or you are not the creator");
  }

  return {
    message: "poll results are now public!",
    poll: updatePoll,
  };
};

const getPublicResult = async (pollId) => {
  if (!pollId) {
    throw ApiError.conflict("poll ID is missing");
  }

  const [findPoll] = await db
    .select()
    .from(pools)
    .where(eq(pools.id, pollId))
    .limit(1);

  if (!findPoll) {
    throw ApiError.notFound("poll not found!");
  }

  if (!findPoll.isPublished) {
    throw ApiError.conflict("poll results not published yet!");
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


  return {
    poll: findPoll,
    totalVotes: optionsWithCount.reduce(
      (acc, curr) => acc + Number(curr.count),
      0,
    ),
    optionsWithCount,
  };
};

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
