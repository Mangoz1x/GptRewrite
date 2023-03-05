const query = async (action, params) => {
    if (!(action || params)) return { error: `Please provide action and params` };
    const query = await fetch("/api/admin/db", {
        method: "POST",
        body: JSON.stringify({
            action,
            params 
        })
    });

    const response = await query.json();
    return response; 
}

export { query };