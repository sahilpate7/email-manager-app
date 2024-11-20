import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "@lib/auth";
import {getTemplate} from "@lib/dbs/firebase";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        const {template} = req.body;
        const {storeHash} = await getSession(req);

        try {
            const result = await getTemplate(storeHash,template);
                
            if (result){
                // console.log(result)
                res.status(200).json({ message: 'Data received',data:result });
                
            } else {
                res.status(500).json({error: 'Failed to save template'});
            }
            
        } catch (error) {
            res.status(500).json({ error: error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('An error occurred while saving the template');
    }
}