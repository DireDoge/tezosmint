import { Sotez } from 'sotez';
import fs from 'fs';

const config = {
    contractAddress: "KT1BJC12dG17CVvPKJ1VYaNnaT5mzfnUTwXv",
    "fee": 500000,
};

(async () => {
    let privatekeys: string[] = [];
    let data = fs.readFileSync('accounts.csv', 'utf8');
    var dataArray = data.split(/\r?\n/);
    let csv = dataArray.filter(key => {
        return (key.length > 0)
    });
    csv.forEach(line => {
        let privatekey = line.trim();
        privatekey = privatekey.replace(/(\r\n|\n|\r)/gm, "");
        privatekeys.push(privatekey)
    })
    console.log(privatekeys)
    privatekeys.forEach(async (privatekey) => {
        try {
            console.log(privatekey)
            const tezos = new Sotez('https://rpc.tzstats.com');
            await tezos.importKey(privatekey)
            const contract = await tezos.loadContract(config.contractAddress);
            const { methods } = contract;
            let operation = await methods.mint(16930).send({fee: config.fee,amount: 100});
            console.log(operation)
        }
        catch (e) {
            console.log(e);
        }
    })
})();
