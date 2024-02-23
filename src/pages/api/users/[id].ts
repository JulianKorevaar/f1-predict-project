import { NextApiRequest, NextApiResponse } from 'next';

import { connect } from '../../../../utils/connection';
import { ResponseFuncs } from '../../../utils/types';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // capture request method, we type it as a key of ResponseFunc to reduce typing later
  const method: keyof ResponseFuncs = req.method as keyof ResponseFuncs;

  // function for catch errors
  const catcher = (error: Error) => res.status(400).json({ error });

  // GRAB ID FROM req.query (where next stores params)
  const id: string = req.query.id as string;

  // Potential Responses for /todos/:id
  const handleCase: ResponseFuncs = {
    // RESPONSE FOR GET REQUESTS
    // eslint-disable-next-line consistent-return
    GET: async (_req: NextApiRequest, resGET: NextApiResponse) => {
      const { User } = await connect(); // connect to database

      const data = id.split('-');
      const name = data[0];
      const code = data[1];

      if (!name || !code)
        return resGET.status(400).json({ error: 'Invalid ID' });

      resGET.json(await User.find({ name, code }).catch(catcher));
    },
    // RESPONSE PUT REQUESTS
    PUT: async (reqPUT: NextApiRequest, resPUT: NextApiResponse) => {
      const { User } = await connect(); // connect to database
      resPUT.json(
        await User.findByIdAndUpdate(id, reqPUT.body, { new: true }).catch(
          catcher
        )
      );
    },
    // RESPONSE FOR DELETE REQUESTS
    DELETE: async (_req: NextApiRequest, resDELETE: NextApiResponse) => {
      const { User } = await connect(); // connect to database
      resDELETE.json(await User.findByIdAndRemove(id).catch(catcher));
    },
  };

  // Check if there is a response for the particular method, if so invoke it, if not response with an error
  const response = handleCase[method];
  if (response) response(req, res);
  else res.status(400).json({ error: 'No Response for This Request' });
};

export default handler;
