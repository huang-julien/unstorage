import { defineDriver } from "./utils";
import { DaprClient, type DaprClientOptions } from "@dapr/dapr"

export interface DaprOptions {
    clientOptions: DaprClientOptions
    storeName: string
}

const DRIVER_NAME = "dapr";

export default defineDriver((opts: DaprOptions) => {

    let client: DaprClient|undefined

    const getClient =   () => {
        if(client) return client 
        client = new DaprClient(opts.clientOptions)

         return client
    }


    return {
        name: 'dapr',
        options: opts,
        getInstance: getClient,
        async hasItem(key, options) {
            return Boolean(getClient().state.get(opts.storeName, key, options))
        },
        getItem(key, options) {
            return getClient().state.get(opts.storeName, key, options)
        },
        getKeys() {
            return getClient().state.query(opts.clientOptions, {
                
            })
        },
        setItem(key, value, options) {
            return getClient().state.save(opts.storeName, [{key, value}], options)
        },
        async setItems(items, sharedOpts) {
            getClient().state.transaction(opts.storeName,)
            return await Promise.allSettled(items.map((item) => {
                return this.setItem!(item.key, item.value, {
                    ...sharedOpts,
                    ...item.options
                })
            }))
        },
        dispose(){
            return (getClient()).stop()
        }
    }
})