import {NextApiRequest, NextApiResponse} from "next";
import {getSession} from "@lib/auth";
import {setAdminSettings} from "@lib/dbs/firebase";

export default async function handler(req: NextApiRequest, res:NextApiResponse) {
    if (req.method === 'POST') {
        const settings = req.body;
        const {storeHash} = await getSession(req);

        try {
            for (const { fieldName, value } of settings) {
                const result = await setAdminSettings(storeHash, fieldName, value);
                if (!result) {
                    return res.status(500).json({ error: `Failed to save setting: ${fieldName}` });
                }
            }
            res.status(200).json({ message: 'All settings saved successfully' });
        } catch (error) {
            res.status(500).json({ error: error });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end('An error occurred while saving');
    }
}