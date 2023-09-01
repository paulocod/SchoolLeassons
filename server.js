const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

let messages = [];
let messageId = 1;

const addHateoasLinks = (message) => {
  const messageId = message.id;
  message.links = [
    {
      rel: 'self',
      method: 'GET',
      href: `/messages/${messageId}`
    },
    {
      rel: 'update',
      method: 'PUT',
      href: `/messages/${messageId}`
    }
  ];
  return message;
};

app.post('/messages', (req, res) => {
  const { content, author } = req.body;
  const newMessage = {
    id: messageId++,
    content,
    author
  };
  messages.push(newMessage);
  res.status(201).json(addHateoasLinks(newMessage));
});

app.put('/messages/:id', (req, res) => {
  const messageId = parseInt(req.params.id);
  const { content } = req.body;

  const messageToUpdate = messages.find(message => message.id === messageId);
  if (!messageToUpdate) {
    return res.status(404).json({ error: 'Message not found' });
  }

  messageToUpdate.content = content;
  res.json(addHateoasLinks(messageToUpdate));
});

app.get('/messages', (req, res) => {
  const messagesWithLinks = messages.map(message => addHateoasLinks(message));
  res.json(messagesWithLinks);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
