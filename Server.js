const root = GetResourcePath(GetCurrentResourceName());
const fs = require('fs');
const line = "^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^4~^5-^0"

enableStatusReturn = true

function readyUp(portArg, authCodeArg) {
    const port = portArg
    const authCode = authCodeArg
    const express = require('express')
    const MySQL = require('fivem-mysql-async-js')

    const app = express()

    const bWords = ["'", '"', "-", "_", "[", "@", "!", "#", "$", "%", "^", "&", "*", "(", ")", "<", ">", "?", "/", "|", "}", "{", "~", "]"]

    //const allowWords = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", ":"]

    function onlyLettersAndNumbers(str) {
        return /^[A-Za-z0-9":"]*$/.test(str);
    }

    app.get('/unban', (req, res) => {

        function sendStatus(statusCode) {
            if (enableStatusReturn) {
                return res.sendStatus(statusCode);
            }
        }

        if (req.query.authcode == authCode) {
            if (req.query.hwid) {
                for (const word of bWords) {
                    if (req.query.hwid.includes(word)) {
                        // Possible MySQL Injection
                        sendStatus(400);
                        return
                    }
                }

                if (onlyLettersAndNumbers(req.query.hwid)) {
                    MySQL.fetchScalar('SELECT `bantrue` from lyxos_bans WHERE hwid = @hwid', {
                        '@hwid': req.query.hwid
                    }).then((player) => {
                        if (player == "BAN") {
                            // Unban Player
                            MySQL.fetchScalar('DELETE FROM lyxos_bans WHERE hwid = @hwid', {
                                '@hwid': req.query.hwid
                            })
                            sendStatus(500);
                        } else {
                            // Player not founded
                            sendStatus(400);
                        }
                    })
                } else {
                    // Possible MySQL Injection
                    sendStatus(400);
                }
            } else {
                // HWID Empty
                sendStatus(500);
            }
        } else {
            // AUTH CODE EMPTY OR WRONG
            sendStatus(403)
        }
    })

    app.get('/', (req, res) => {})

    app.listen(port, () => {
        //
    })
}

fs.readFile(`${root}/Config.json`, (err, data) => {
    if (err) {
        console.log("^7[^1Lyxos^2-^8UnbanBot^7]^3", "^3An internal server error occurred while loading Config..")
        console.log("^7[^1Lyxos^2-^8UnbanBot^7]^3", "^3Error:^0");
        throw err;
    } else {
        console.log(line)
        console.log("^7[^1Lyxos^2-^8UnbanBot^7]^3 Loading Config..")
        console.log("^7[^1Lyxos^2-^8UnbanBot^7]^2 Config successfully loaded!^0")
        console.log(line)
    }

    var configData = JSON.parse(data);
    const port = configData['Port']
    const authCode = configData['AuthCode']
    enableStatusReturn = configData['WebStatusReturn']
    readyUp(port, authCode)
});

/*
- Created by zImSkillz
- Created at 21:06 GMT+1
- DD/MM/YYYY
- 22.11.2022
*/