const e = require('express');

module.exports = function (app) {

   
    const nanoid = require('nanoid');
    const idLenght= 5;
    let posts = [
        { id: nanoid.nanoid(idLenght), title: 'Initial Post', author: 'Lucila Coronel' }
    ];

    // defining an endpoint to return all posts
    app.get('/posts/', (req, res) => {
        // #swagger.tags = ['Posts']
        // #swagger.description = 'Get all posts'
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Posts" },
               description: 'all posts.' 
        } */
        res.send(posts);
    });

    app.post('/posts/', async (req, res) => {

        // #swagger.tags = ['Posts']
        // #swagger.description = 'add a post'
        /* #swagger.parameters['newPost'] = {
               in: 'body',
               description: 'post information',
               required: true,
               schema: { $ref: "#/definitions/AddPost" }
        } */
        /* #swagger.responses[200] = { 
               schema: { $ref: "#/definitions/Post" },
               description: 'new post.' 
        } */
        const { title, author, } = req.body;
        const newPost = { id: nanoid.nanoid(idLenght), title: title, author: author };

        await insterPost(newPost);
        res.send({ message: 'New Post inserted.' });
    });

    // endpoint to delete an post
    app.delete('/posts/:id', async (req, res) => {
        // #swagger.tags = ['Posts']
        // #swagger.description = 'Delete a post'
        // #swagger.parameters['id'] = { description: 'post id' }
        
       const id = req.params.id;
        try {
            await deletePost(id);
            res.send({ message: 'Post removed.' });
        } catch (error) {
            return res.status(400).json({ error: `post with id ${id } not found`  })
        }
       
    });

    // endpoint to update an post
    app.put('/posts/:id', async (req, res) => {
        // #swagger.tags = ['Posts']
        // #swagger.description = 'Update a post'
        // #swagger.parameters['id'] = { description: 'post id' }
        /* #swagger.parameters['newPost'] = {
              in: 'body',
              description: 'post information',
              required: true,
              schema: { $ref: "#/definitions/AddPost" }
       } */
        const { title, author, } = req.body;
        const id = req.params.id;
        const updatedPost = { id: id, title: title, author: author };
        try {
            await updatePost(id, updatedPost);
            res.send({ message: 'Post updated.' });
        } catch (error) {
            return res.status(400).json({ error: `post with id ${id } not found`  })
        }
       
    });

    async function insterPost(newPost) {
        posts.push(newPost);
    }
    async function deletePost(id) {
        const postExists = posts.find(x => x.id === id);
        if (!postExists) {
          throw "id not found";

        }
        postIndex = posts.map(x => { return x.id; }).indexOf(id);
        posts.splice(posts.indexOf(postIndex));
    }
    async function updatePost(id, newPost) {
        const postExists = posts.find(x => x.id === id);
        if (!postExists) {
            throw "id not found";

        }
        postIndex = posts.map(x => { return x.id; }).indexOf(id);
        posts[postIndex] = newPost;
    }
}