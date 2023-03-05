const Parse = (string) => { try { return JSON.parse(string) } catch (err) { return {} } } 

export { Parse };