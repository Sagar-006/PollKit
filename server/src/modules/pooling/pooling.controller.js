import * as pollingService from "./pooling.service.js";
import ApiError from "../../common/utils/api-error.js";
const createPool = async (req, res, next) => {
  try {
    const { question, pollOptions, anonymousVoting, expiresAt } = req.body;
    const result = await pollingService.createPool(
      req.user.id,
      question,
      pollOptions,
      anonymousVoting,
      expiresAt,
    );
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

const allPools = async (req, res) => {
  const result = await pollingService.allPools(req.user.id);
  res.json({ result: result });
};

const deletePool = async (req, res) => {
  const result = await pollingService.deletePool(req.params.poolid);
  res.json({ result: result });
};

const getPoll = async (req, res) => {
  const result = await pollingService.getPoll(req.params.pollid);
  res.json({ result: result });
};
const createVote = async (req, res, next) => {

  try {
    const pollId = req.params.pollid;
    
    const alreadyVoted = req.cookies[`voted-${pollId}`];

    if (alreadyVoted) {
      throw ApiError.badRequest("You already voted for this poll");
    }

    const result = await pollingService.createVote({
      userId: req.user?.id || null,
      pollId: pollId,
      optionId: req.body.optionId,
      ip: req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.ip,
    });

    if (result.message === "vote successfully") {
      res.cookie(`voted-${result.result.pollId}`, "true", {
        httpOnly: true,
        maxAge: 10 * 24 * 60 * 60 * 1000,
      });
    }
    res.json({ result: result });
  } catch (e) {
    next(e);
  }
};

const getAnalytics = async (req, res) => {
  const result = await pollingService.getAnalytics(
    req.params.pollid,
    req.user.id,
  );
  res.json({
    result: result,
  });
};

const getPublicPoll = async (req, res) => {
  const result = await pollingService.getPublicPoll(req.params.pollid);
  res.json({
    result,
  });
};

const publishPoll = async (req, res) => {
  
  const result = await pollingService.publishPoll(
    req.params.pollid,
    req.user.id,
  );
  res.json({
    result,
  });
};

const getPublicResult = async (req, res) => {
  const result = await pollingService.getPublicResult(req.params.pollid);
  res.json({
    result,
  });
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
