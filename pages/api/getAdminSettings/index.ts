import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "@lib/auth";
import {getAdminSettings} from "@lib/dbs/firebase";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        const {fieldName} = req.body;
        const {storeHash} = await getSession(req);

        try {
            const result = await getAdminSettings(storeHash,fieldName);

            if (result){
                res.status(200).json({ message: 'Data received',data:result });

            } else {
                res.status(500).json({error: 'Failed to get data'});
            }

        } catch (error) {
            res.status(500).json({ error: error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('An error occurred while saving the template');
    }
}