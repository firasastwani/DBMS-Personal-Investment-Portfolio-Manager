
interface Stock {
    id: number
    symbol: string;
    name: string;
    staticPrice: number;
}

interface StockRowProps {
    stock: Stock;
}


const StockRow: React.FC<StockRowProps> = ({ stock }) => {
    return (
        <tr className="hover:bg-gray-50" key={stock.id} data-symbol={stock.symbol}>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium">{stock.name}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium">{stock.symbol}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium">{stock.staticPrice.toFixed(2)}</div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    data-action="add-to-watchlist"
                >
                    Add to Watchlist
                </button>
            </td>
        </tr>
    )
}

export default StockRow;