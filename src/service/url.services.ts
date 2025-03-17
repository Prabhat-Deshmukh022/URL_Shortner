import {prisma} from "../config/prisma.ts"
import type { Prisma } from "@prisma/client"

async function createUrl(
    originalUrl:string, 
    shortenedCode:string, 
    userId:string,alias?:string,
    regionBasedUrls?:Prisma.JsonObject,
    timeBasedUrls?:Prisma.JsonArray,
    abtestingUrls?:Prisma.JsonArray
){

    const exists = await prisma.url.findUnique({
        where:{
            shortenedCode:shortenedCode
        }
    })

    if(shortenedCode && exists){
        throw new Error("Shortened code already exists!")
    }

    return await prisma.url.create({
        data:{
            originalUrl,
            shortenedCode,
            expiresIn: new Date(new Date().setFullYear(new Date().getFullYear() + 5)),
            regionBasedUrls,
            timeBasedUrls,
            abtestingUrls,
            user:{
                connect:{
                    id: userId
                }
            }
        }
    })
}

async function findUrlByShortUrl(shortenedCode:string){
    const url =  await prisma.url.findUnique({
        where:{
            shortenedCode:shortenedCode
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
        },
    })
}

async function findExpiry(shortenedCode:string){
    const url = await prisma.url.findUnique({
        where:{
            shortenedCode:shortenedCode
        }
    })

    return url?.expiresIn
}

export { createUrl,findUrlByShortUrl,findUrlByAlias,findShortenedUrls,findExpiry }