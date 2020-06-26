import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: Request): Transaction {
    const transaction = new Transaction({
      title,
      value,
      type,
    });

    const { total } = this.transactionsRepository.getBalance();
    if (type !== 'income' && type !== 'outcome') {
      throw Error("Type of transaction must be 'income' or 'outcome'");
    }

    if (type === 'outcome' && value > total) {
      throw Error('Outcome value is greater than the total in account!!');
    }

    const transactionResponse = this.transactionsRepository.create(transaction);

    return transactionResponse;
  }
}

export default CreateTransactionService;
