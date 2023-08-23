const { logCommand } = require('../helper/LogCommand');

const getCommand = (req, res) => {
    const search = req.params.query;
    if (!search) return res.status(400).json({ "message": 'Search Query required' });
    return res.status(200).json({ 'message': `Your search is ${search}` });
}


const postCommand = (req, res) => {
    search = req.body.search;
    if (!search) return res.status(400).json({ 'message': 'Search Query required' });
    // if search query is valid, log it to cloudwatch
    if (logCommand(search, req.user)){
        return res.status(200).json({ 'message': `Your search is ${search} ` });
    }

}



module.exports = { getCommand, postCommand }