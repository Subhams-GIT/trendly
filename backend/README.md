# backend
drizzle uuid

# structure of ans
{
    question,
    ans
}

pehle mere pass questions an answers he and the data of survey as well
so survey and asnwers do ek sath body me process kar sakte hai
so i need to need to

## apis need to be done
1. get a survey from a link
2. fill the survey and submit it
3. get a poll
4. answer the poll
5. all the answered polls and survey should have a analytics visible to every user

- private poll
if the poll or survey is private then i need to have a users list for sending the email to them .
each email will be having a row in the private users list with a separate token associated with them . on the backend that token will be checked if present then only load the poll for them else dont load

url -> http://localhost:3000/t?=msndy3747&i=3488 for private users of a survey or a poll
private users ke liye we just need the survey id and check if the user is signed in or not 
