import { publicProcedure, router } from "../server";

export const bountyRouter = router({
    getAll: publicProcedure
    .query(async ({ ctx}) => {
        return await ctx.db.bounty.findMany()
    })

    
    //create: protected

    //update: protected

    //delete: protected

    //getById: public
    
    //collect: protected

});
