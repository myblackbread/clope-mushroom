import { TransactionData } from "../core";

export type MushroomFeature = string;

export class MushroomDataLoader {
    async fetchTransactions(): Promise<string[][]> {
        const urlString = "/data/agaricus-lepiota.data";// "https://archive.ics.uci.edu/ml/machine-learning-databases/mushroom/agaricus-lepiota.data";

        const response = await fetch(urlString);

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status} ${response.statusText}`);
        }

        const content = await response.text();

        const rows = content.split('\n').filter(row => row.trim() !== '');

        const transactions = rows.map(row => {
            const elements = row.split(',');
            const features: MushroomFeature[] = [];

            elements.forEach((element, offset) => {
                const char = element.trim().charAt(0);
                if (char && char !== '?') {
                    features.push(`${offset}:${char}`);
                }
            });

            return features;
        });

        return transactions;
    }
}