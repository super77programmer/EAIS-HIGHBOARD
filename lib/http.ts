export class ApiResponseError extends Error{constructor(message:string,public status:number){super(message);this.name='ApiResponseError'}}
// Hosting sign-in pages and proxy error documents are not application data.
export async function readJSON<T=any>(response:Response):Promise<T>{
 const text=await response.text();const html=/^\s*(?:<!doctype\s+html|<html\b|<)/i.test(text)||response.headers.get('content-type')?.includes('text/html');
 if(html||response.redirected){const expired=response.redirected||response.status===401||response.status===403;throw new ApiResponseError(expired?'Your session needs refreshing. Refresh this page, then sign in again. Keep this page open to preserve your draft.':response.status>=500?'The school service is temporarily unavailable. Retry shortly. Keep this page open to preserve your draft.':'The school service returned an unexpected page. Refresh this page and try again.',expired?401:response.status>=400?response.status:502)}
 try{return JSON.parse(text) as T}catch{throw new ApiResponseError(response.status>=500?'The school service is temporarily unavailable. Please retry shortly.':'The school service returned an incomplete response. Please retry.',response.status>=400?response.status:502)}
}
