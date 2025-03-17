import type { Context } from "hono";
import { urlValidationSchema } from "../util/validation.ts";
import { createUrl, findUrlByAlias } from "../service/url.services.ts";
import { generateShortUrl } from "../util/generateShortUrl.ts";
import { domain } from "../constants.ts";

async function produceShortUrl(c:Context){
    const userId = c.get("userId")

    if(!userId){
        console.log(`User not logged in!`);
        return c.json({message:`User not logged in!`}, 401)
    }

    const input = await c.req.json()

    const check = urlValidationSchema.safeParse(input)

    if(!check.success){
        console.log(`Invalid url!`);
        return c.json({message:`Invalid url!`},401)
    }

    const { originalUrl,alias,regionBasedUrls,timeBasedUrls,abtestingUrls } = check.data
    let shortenedUrl=""
    let code=""

    if(alias && alias?.length!==0){
        const checkIfAliasExists = await findUrlByAlias(alias)
        
        if(checkIfAliasExists){
            console.log(`Alias unavailable!`);
            return c.json({message:`Alias unavailable!`},401)
        }

        shortenedUrl = `https://${domain}/${alias}`

    }
    else{
        code = generateShortUrl()

        shortenedUrl = `https://${domain}/${code}`

    }

    const urlCreated = await createUrl(originalUrl,code,userId,alias || undefined,regionBasedUrls,timeBasedUrls,abtestingUrls)

    if(!urlCreated){
        console.log(`Error creating short url!`);
        c.json({message:`Error creating short url!`},500)
    }

    return c.json({message:`Shortened url created! ${shortenedUrl}`},200)

}

export { produceShortUrl }