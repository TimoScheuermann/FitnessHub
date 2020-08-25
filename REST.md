# Endpoints

### User

| Type | Path       | Parameter  | Body | Returns          |
| ---- | ---------- | ---------- | ---- | ---------------- |
| POST | /verify    | x          | x    | error / true     |
| GET  | /:id       | id: string | x    | IUserInfo        |
| GET  | /:id/plans | id: string | x    | ITrainingsPlan[] |

### Auth

| Type | Path    | Parameter | Body | Returns |
| ---- | ------- | --------- | ---- | ------- |
| GET  | /google | x         | x    | x       |
| GET  | /github | x         | x    | x       |
