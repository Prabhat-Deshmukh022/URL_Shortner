import {prisma} from "../config/prisma.ts"

async function createUrl(originalUrl:string, shortenedUrl:string, userId:string,alias?:string){

    const exists = await prisma.url.findUnique({
        where:{
            shortenedUrl:shortenedUrl
        }
    })

    if(shortenedUrl && exists){
        throw new Error("Shortened code already exists!")
    }

    return await prisma.url.create({
        data:{
            originalUrl,
            shortenedUrl,
            expiresIn: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
            user:{
                connect:{
                    id: userId
                }
            }
        }
    })
}

async function findUrlByShortUrl(shortenedUrl:string){
    const url =  await prisma.url.findUnique({
        where:{
            shortenedUrl:shortenedUrl
        }
    })

    return url?.originalUrl
}

async function findUrlByAlias(alias:string){
    return await prisma.url.findUnique({
        where:{
            alias:alias
        }
    })
}

async function findShortenedUrls(originalUrl:string){
    return await prisma.url.findMany({
        where:{
            originalUrl:originalUrl
        }
    })
}

export { createUrl,findUrlByShortUrl,findUrlByAlias,findShortenedUrls }