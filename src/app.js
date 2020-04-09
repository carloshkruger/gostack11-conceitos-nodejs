const express = require("express");
const cors = require("cors");

 const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

const getRepositoryIndexById = id => repositories.findIndex(repository => repository.id === id);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const id = uuid();

  const repository = {
    id,
    title,
    url,
    techs,
    likes: 0
  };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const id = request.params.id;

  const repositoryIndex = getRepositoryIndexById(id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = { ...repositories[repositoryIndex], title, url, techs };

  repositories[repositoryIndex]  = repository;

  return response.json(repository);
});

app.delete("/repositories/:id", (req, res) => {
  const id = req.params.id;
  const repositoryIndex = getRepositoryIndexById(id);

  if(repositoryIndex < 0) {
    return res.status(400).json({ error: 'Repository not found.' });
  }  

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const id = request.params.id;
  const repositoryIndex = getRepositoryIndexById(id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository not found.' });
  }

  const repository = repositories[repositoryIndex];
  let { likes } = repository;
  const updatedRepository = { ...repository, likes: ++likes };

  repositories[repositoryIndex]  = updatedRepository;

  return response.json(updatedRepository);
});

module.exports = app;
