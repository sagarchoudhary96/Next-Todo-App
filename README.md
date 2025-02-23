# Next Todo App

## [Live Version](https://next-todo-app-alpha-one.vercel.app)

A web-based task management application similar to Notion, Asana, and Linear allows users to manage tasks (create, read, update, and delete (CRUD) tasks) and filter, sort, and paginate through them. It also allows creating custom Fields for the tasks, making the task structure dynamic and generating UI accordingly.

## Requirements

- yarn

## Libraries Used

- [Next.JS](https://nextjs.org/)
- [Shadcn](https://ui.shadcn.com/)
- [Tailwindcss V4](https://tailwindcss.com/)

## How to run:

1. [Download](https://github.com/sagarchoudhary96/Next-Todo-App/archive/refs/heads/main.zip) or [Clone](https://github.com/sagarchoudhary96/Next-Todo-App.git) the Repository.
2. Run `yarn install` to install the project dependencies.

3. Run `yarn dev` to run the app in development mode.

4. App can be seen at: [http://localhost:3000](http://localhost:3000).


## Functionalities
* The Project provides a task management UI that allows users to add, update, and remove tasks.

* The interface allows for filtering, sorting, and searching tasks using controls provided in table headers.

* It uses `localStorage` to store the data within the browser and the initial data is loaded from the `data` folder for both the todo list and base field columns.

* Basic Pagination is implemented.

* A custom Field Editor is implemented to dynamically add new fields to the tasks letting them create new fields of `Text, Number or Select` type and also letting the user filter/sort using custom fields.


## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
