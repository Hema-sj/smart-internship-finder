export function getHealth(_request, response) { response.status(200).json({ status: 'ok', service: 'smart-internship-finder-api', message: 'Backend API is healthy' }); }
