import { Hono } from "hono";


function validatePass(ctx) {
    return ctx.text("Hello Hono!");
} 

export {
    validatePass,
}