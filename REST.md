# Endpoints

### User

| Type | Path       | Parameter  | Body | Returns         | Description                     |
| ---- | ---------- | ---------- | ---- | --------------- | ------------------------------- |
| POST | /verify    | x          | x    | error / true    | Check if a user is verified     |
| GET  | /:id       | id: string | x    | IUserInfo       | returns a users name and avatar |
| GET  | /:id/plans | id: string | x    | ITrainingplan[] | returns a users created plans   |

### Auth

| Type | Path    | Parameter | Body | Returns | Description         |
| ---- | ------- | --------- | ---- | ------- | ------------------- |
| GET  | /google | x         | x    | x       | Sign in with Google |
| GET  | /github | x         | x    | x       | Sign in with GitHub |
| GET  | /adobe  | x         | x    | x       | Sign in with Adobe  |
| GET  | /amazon | x         | x    | x       | Sign in with Amazon |
| GET  | /steam  | x         | x    | x       | Sign in with Steam  |

### Trainingplan

| Type   | Path | Parameter  | Body          | Returns                   | Description                             |
| ------ | ---- | ---------- | ------------- | ------------------------- | --------------------------------------- |
| GET    | /    | x          | x             | ITrainingplan[]           | Returns all plans (limit curretly 50)   |
| GET    | /:id | id:string  | x             | ITrainingplan / undefined | returns a specific plan                 |
| POST   | /    | x          | ITrainingplan | ITrainingplan             | creates a new plan and returns it       |
| PUT    | /    | x          | ITrainingplan | ITrainingplan             | updates an existing plan and returns it |
| DELETE | /:id | id: string | x             | x                         | deletes a plan by its id                |
