Refferal
----------

POST http://localhost:4500/referral/create

H-> userid TbRLeGQObCfS5qmdWfuhAtk9EEG2

Res -> http://localhost:4500/referral/dineshkit/4X7tRD


GET http://localhost:4500/referral/dineshkit/4X7tRD

H-> userid e3JoQS5MAfabk02MzbQ4yewkHwS2

Res -> Referral Updated

GET http://localhost:4500/referral/show

H-> userid TbRLeGQObCfS5qmdWfuhAtk9EEG2

Res -> 
[
    {
        "date": "4/15/2021, 11:12:40 AM",
        "userid": "e3JoQS5MAfabk02MzbQ4yewkHwS2",
        "name": "diensh"
    }
]