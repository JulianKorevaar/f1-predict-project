import { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const options = {
    method: req.method,
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(req.body),
  };

  const response = await fetch(`${process.env.API_URL}/users`, options);

  const data = await response.json();

  res.status(response.status).json(data);
};

export default handler;
