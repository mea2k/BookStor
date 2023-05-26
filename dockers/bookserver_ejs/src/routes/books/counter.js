import CONFIG from '../../config.js';

const URL_PREFIX = 'http://'
const COUNTER_HOST = process.env.COUNTER_SERVER || CONFIG.counter_server || 'localhost'
const COUNTER_PORT = process.env.COUNTER_PORT || CONFIG.counter_port || 5010
const COUNTER_URL = '/api/counter/'


async function getCounter(bookId) {
    const res = await fetch(URL_PREFIX + COUNTER_HOST + ':' + COUNTER_PORT + COUNTER_URL + bookId)
    // если не найдена книга - пытаемся добавить для нее счетчик
    if (res.ok) {
        const data = await res.json()
        return {
            ...data,
            datetime: data.datetime ? new Date(data.datetime).toLocaleDateString("ru-RU",
                {
                    day: 'numeric',
                    year: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                }) : undefined
        }
    }
    else {
        // если книга не найдена - возвращаем 0
        return { counter: 0 }
    }

}


async function incCounter(bookId) {
    const COUNTER_URL_FULL = URL_PREFIX + COUNTER_HOST + ':' + COUNTER_PORT + COUNTER_URL + bookId + '/inc'
    const res = await fetch(COUNTER_URL_FULL, { method: 'POST'})
 
    if (res.ok) {
        const data = await res.json()
        return data
    }
    else return {}
}

async function delCounter(bookId) {
    const COUNTER_URL_FULL = URL_PREFIX + COUNTER_HOST + ':' + COUNTER_PORT + COUNTER_URL + bookId
    const res = await fetch(COUNTER_URL_FULL, { method: 'DELETE'})
 
    if (res.ok) {
        const data = await res.json()
        return data
    }
    else return {}
}


export { getCounter, incCounter, delCounter }
