function ifdebug(fn) {
    if (typeof window !== "undefined" && window.DEBUG) {
        fn();
    }
};

export { ifdebug };
