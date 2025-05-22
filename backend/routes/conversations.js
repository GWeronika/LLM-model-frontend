const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

let conversations = [
    {
        id: '1',
        title: 'Discussing React component structure',
        updateDate: '2025-05-12T12:00:00Z',
        category: 'Explaining',
        messages: [
            { sender: 'user', text: 'How should I structure my components in React?' },
            { sender: 'bot', text: 'It depends on your app, but usually by feature...' },
        ]
    },
    {
        id: '2',
        title: 'Python code to connect to MongoDB',
        updateDate: '2025-05-11T08:20:00Z',
        category: 'Code Generation',
        messages: [
            { sender: 'user', text: 'How do I connect to MongoDB in Python?' },
            { sender: 'bot', text: 'You can use pymongo library like this:\n\n```python\nimport pymongo\n```' },
        ]
    },
    {
        id: '3',
        title: 'Creating a Person class in Java',
        updateDate: '2025-05-10T15:00:00Z',
        category: 'Code Generation',
        messages: [
            { sender: 'user', text: 'Can you help me write a Person class in Java with some fields and functions?' },
            { sender: 'bot', text: 'Sure! Here\'s an example:\n\n```java\npublic class Person {\n    private String name;\n    private int age;\n\n    public Person(String name, int age) {\n        this.name = name;\n        this.age = age;\n    }\n\n    public String getName() {\n        return name;\n    }\n\n    public void setName(String name) {\n        this.name = name;\n    }\n\n    public int getAge() {\n        return age;\n    }\n\n    public void setAge(int age) {\n        this.age = age;\n    }\n\n    public String introduce() {\n        return \"Hi, my name is \" + name + \" and I am \" + age + \" years old.\";\n    }\n}\n```' },
        ]
    }
];

router.get('/', (_, res) => {
    res.json(conversations);
});

router.post('/', (req, res) => {
    const { category } = req.body;
    const id = uuidv4();
    const newConv = {
        id,
        title: `New ${category} Conversation`,
        updateDate: new Date().toISOString(),
        category,
        messages: []
    };
    conversations.push(newConv);
    res.json(newConv);
});

router.put('/:id', (req, res) => {
    const conv = conversations.find(c => c.id === req.params.id);
    if (!conv) return res.status(404).json({ error: 'Conversation not found' });
    conv.title = req.body.title;
    res.json(conv);
});

module.exports = router;
