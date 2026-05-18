const debt = {
  title: 'Debt Book',
  subtitle: 'Track money lent and borrowing',
  addTransaction: 'Add Transaction',
  updateTransaction: 'Update Transaction',
  addNewTransaction: 'Add New Transaction',
  owedToMe: 'Others owe me',
  iOwe: 'I owe others',
  people: '{{count}} people',
  netBalance: 'Net Balance',
  moreReceived: 'More Received',
  morePaid: 'More Paid',
  lend: 'Lend',
  borrow: 'Borrow',
  form: {
    personName: 'Lender/Borrower Name',
    amount: 'Amount (VND)',
    borrowDate: 'Borrow Date',
    dueDate: 'Due Date',
    note: 'Note (optional)',
    save: 'Save',
    cancel: 'Cancel',
  },
  list: {
    borrowDate: 'Borrow Date',
    dueDate: 'Due',
    overdue: 'Overdue by {{days}} days',
    noLendTransactions: 'No lending transactions yet',
    noBorrowTransactions: 'No borrowing transactions yet',
    amount: 'Amount',
    deleteConfirmMessage: 'Are you sure you want to delete it?',
  },
  search: {
    title: 'Search',
    person: {
      input: 'Person name',
      select: 'Select person name ...',
    },
    note: 'Note',
  },
  noMatchingPerson: 'No matching person found',
  offsetApplied: 'Offset {{amount}}',
  offsetBreakdownLent: 'Lent {{lent}} − Borrowed back {{borrowed}}',
  offsetBreakdownBorrowed: 'Borrowed {{borrowed}} − Repaid {{lent}}',
  offsetDetail:
    'Offset {{offsetAmount}} (lent {{lent}}, borrowed back {{borrowed}}) → remaining {{net}}',
}

export default debt
