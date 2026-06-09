import * as pollingService from "./pooling.service.js";
const createPool = async (req, res) => {

  const { question, options, anonymousVoting } = req.body;
  // console.log("at create pool controller.",req.body.options);
  const result = await pollingService.createPool(
    req.user.id,
    question,
    options,
    anonymousVoting,
  );
  res.json({ data: result });
};

const allPools = async (req, res) => {
  const result = await pollingService.allPools(req.user.id);
  res.json({ result: result });
};

const deletePool = async (req, res) => {
  console.log("poolId at contoller", req.params.poolid);
  const result = await pollingService.deletePool(req.params.poolid);
  res.json({ result: result });
};

const getPoll = async (req, res) => {
  const result = await pollingService.getPoll(req.params.pollid);
  res.json({ result: result });
};
const createVote = async (req,res) => {
  // console.log("ip at controller", req.headers["x-forwarded-for"]);
  const result = await pollingService.createVote({
    userId: req.user?.id || null,
    pollId: req.params.pollid,
    optionId: req.body.optionId,
    expiresIn: req.body.expiresIn,
    ip: req.headers["x-forwarded-for"],
  });
  res.json({ result: result });
};

const getAnalytics = async (req,res) => {
  const result = await pollingService.getAnalytics(req.params.pollid,req.user.id);
  console.log("result at controller",result);
  res.json({
    result:result
  })
}

const getPublicPoll = async (req,res) => {
  const result = await pollingService.getPublicPoll(req.params.pollid);
  res.json({
    result
  })
};

const publishPoll = async (req,res) => {
  const result = await pollingService.publishPoll(req.params.pollid,req.user.id);
  res.json({
    result
  })

};

const getPublicResult = async (req,res) => {
  const result = await pollingService.getPublicResult(req.params.pollid)
  res.json({
    result
  });
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
