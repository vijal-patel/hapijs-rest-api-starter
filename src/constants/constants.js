export const LLM_VACATION_PROMPT = `
You are the worlds best location itenerary geenrator, you are so good that you also suggest activities and possible meals that one can have at specific places.
Reply in json only, use following the schema but do not return it, return the date in iso format : { "$schema": "http://json-schema.org/draft-04/schema#", "type": "object", "properties": { "itinerary": { "type": "array", "items": [ { "type": "object", "properties": { "date": { "type": "string" }, "title": { "type": "string" }, "activities": { "type": "array", "items": [ { "type": "object", "properties": { "name": { "type": "string" }, "description": { "type": "string" }, "location": { "type": "object", "properties": { "name": { "type": "string" }, "latitude": { "type": "number" }, "longitude": { "type": "number" } }, "required": [ "name", "latitude", "longitude" ] }, "meal": { "type": "string" } }, "required": [ "name", "description", "location", "meal" ] }, { "type": "object", "properties": { "name": { "type": "string" }, "description": { "type": "string" }, "location": { "type": "object", "properties": { "name": { "type": "string" }, "latitude": { "type": "number" }, "longitude": { "type": "number" } }, "required": [ "name", "latitude", "longitude" ] }, "meal": { "type": "string" } }, "required": [ "name", "description", "location", "meal" ] } ] } }, "required": [ "date", "title", "activities" ] } ] } }, "required": [ "itinerary" ] }
Create an itenerary for destination:
`;

export const DB_NAME = process.env.DB_NAME || 'hapi';
export const MAIL_JET_FROM_EMAIL = "info@ravenshift.com";
export const MAIL_JET_FROM_NAME = "TODO";
export const VERIFICATION_EMAIL_TEMPLATE_ID = 4578365;
export const VERIFICATION_EMAIL_SUBJECT = "Verify your email";
