import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "@lib/auth";
import {setTemplate} from "@lib/dbs/firebase";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        const {template, templateData } = req.body;
        const {storeHash} = await getSession(req);

        try {
            const result = await setTemplate(storeHash, template, templateData);
            if (result){
                res.status(200).json({ message: 'Template saved' });
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