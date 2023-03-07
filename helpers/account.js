const SessionActive = async () => {
    const request = await fetch("/api/session/active", { method: "POST" });
    const response = await request.json();

    if (response.session === 'active')
        return { session: true, ytmp4: response?.ytmp4 || null, avatar: response?.avatar || null, subscription: response?.subscription || null };
    
    return { session: false };
};

export { SessionActive };