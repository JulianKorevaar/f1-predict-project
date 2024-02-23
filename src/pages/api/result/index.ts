import { NextApiRequest, NextApiResponse } from 'next';

import { connect } from '../../../../utils/connection';
import { AppConfig } from '../../../utils/AppConfig';
import { ResponseFuncs } from '../../../utils/types';

// Function to calculate the points for a prediction and a race result
async function calculatePoints(prediction: any, result: any) {
  return prediction.race.reduce(
    (count: number, predRace: any, index: number) => {
      if (predRace === result.race[index]) {
        return count + (AppConfig.points_good_pick_race[index] || 0);
      }
      return count;
    },
    0
  );
}

// Function to update the points for a user based on a prediction and a race result
async function updatePointsForUser(prediction: any, result: any) {
  const { User } = await connect();
  const user = await User.findOne({ name: prediction.user.trim() });

  if (!user) throw new Error('User not found');

  const points = await calculatePoints(prediction, result);

  user.points += points;

  await user.save();
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  // function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error });

  // Potential Responses
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    GET: async (_req: NextApiRequest, resGET: NextApiResponse) => {
      const { RaceResult } = await connect(); // connect to database
      resGET.json(await RaceResult.find({}).catch(catcher));
    },
    // RESPONSE POST REQUESTS
    POST: async (reqPOST: NextApiRequest, resPOST: NextApiResponse) => {
      const { RaceResult, Prediction } = await connect(); // connect to database
      const result = reqPOST.body as typeof RaceResult;
      const raceResult = await RaceResult.create(result).catch(catcher);

      const predictions = await Prediction.find({
        number: result.number,
      }).catch(catcher);

      await Promise.all(
        predictions.map(async (prediction: any) => {
          await updatePointsForUser(prediction, result);
        })
      );

      resPOST.json(raceResult);
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: 'No Response for This Request' });
};

export default handler;
