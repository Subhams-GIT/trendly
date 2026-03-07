## APIS TO TEST
1. /create-survey -> public
2. /create-survey -> private
3. /ans-survey -> public
4. /ans-survey -> private
5. /create-poll -> public
6. /create-poll -> private
7. /vote-poll  ->public
8. /vote-poll -> private
9. /get-survey -> public

{
    "title":"sample survey",
    "description":"description",
    "state":"open",
    "visibility":"public",
    "expiry":5,
    "Questions":[
        {
            "statement":"what is your name?",
            "option":["subham","souvik"],
            "type":"single"
        }
    ]
}
