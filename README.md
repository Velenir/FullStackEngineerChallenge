# Technologies used
## Client-side
- React, Next.js, Apollo, GraphQl
- Access ar [http://localhost:3000](http://localhost:3000)
 
### Server
- Next.js, Typeorm, type-graphql, GraphQL, SQLite, jsonwebtoken, @graphql-codegen
- Access GraphiQL at [http://localhost:3000/api/graphql](http://localhost:/api/graphql), though you'll have to login for access token first to do anything meaningful (Important in Settings `"request.credentials": "include",`).

Technology choices were made based on type-coverage and fast prototyping.
SQLite is chose so that everything can be done locally without remote DB or docker, or whatever.
Style is minimalistic with styled-jsx, only too have any kind of layout.

## Userbase

Two fixed users:
- Admin Adminovich, login: admin@example.com, password: `admin`
- Employed Employee, login: employee@example.com, password: `employee`

And 10 random employees, login of shape: `[firstName]_[lastName]@example.com`, password: `employee`


## Assumptions
- Only Admin can add new users, employees can't register by themselves
- Only admin can view all reviews and all users
- Admins are also users and can review / be reviewed by others
- Reviews are requested one by one (one reviewee <-> one reviewer), for simplicity
- Employee can only see reviews he submitted or need to submit, or reviews of themselves when completed by others.

## Possible further improvements
 - SSR and Apollo cache hydration
 - better cahcing in general both client and server-side
 - A more powerful DB (Postgresql or MySQL)
 - Better registration, for example:
  - Admin creates user, but not password
  - Email comes to user
  - User follows the link to create/restore password
  - Admin never has access to password
 - Proper styling with Bootstrap, Material-UI or similar
 - Add tests


## Scripts

Run in project directory:
 - `yarn dev` - starts the application in development mode
 - `yarn build` - starts the application in development mode
 - `yarn start` - starts the application in production mode. The application should be compiled with `yarn build` first.

 - `yarn populate` - clears and populates DB (runs `src/sever/db/populate.ts`)
 - `yarn typegen` - generates GQL types from `src/client/schemas/index.graphql`