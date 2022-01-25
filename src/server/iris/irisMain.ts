import crypto from 'server/crypto';

namespace iris {
    /**
     * always check if the token already exists
     */
    function generateIrisToken() {
        return crypto.token(256)
    }
}

export = iris;