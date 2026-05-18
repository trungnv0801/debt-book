const debt = {
  title: 'Sổ Nợ',
  subtitle: 'Theo dõi tiền cho mượn và đi mượn',
  addTransaction: 'Thêm Giao Dịch',
  addNewTraction: 'Thêm Giao Dịch Mới',
  updateTransaction: 'Chỉnh Sửa Giao Dịch',
  owedToMe: 'Người khác nợ tôi',
  iOwe: 'Tôi nợ người khác',
  people: '{{count}} người',
  netBalance: 'Chênh lệch',
  moreReceived: 'Thu về nhiều hơn',
  morePaid: 'Trả nhiều hơn',
  lend: 'Cho mượn',
  borrow: 'Đi mượn',
  form: {
    personName: 'Tên người cho/mượn',
    amount: 'Số tiền (VND)',
    borrowDate: 'Ngày mượn',
    dueDate: 'Hạn trả',
    note: 'Ghi chú (tùy chọn)',
    save: 'Lưu',
    cancel: 'Hủy',
  },
  list: {
    borrowDate: 'Ngày mượn',
    dueDate: 'Hạn trả',
    overdue: 'Quá hạn {{days}} ngày',
    noLendTransactions: 'Chưa có giao dịch cho mượn',
    noBorrowTransactions: 'Chưa có giao dịch đi mượn',
    amount: 'Số tiền',
    deleteConfirmMessage: 'Bạn có chắc chắn muốn xóa nó?',
  },
  search: {
    title: 'Tìm kiếm',
    person: {
      input: 'Tên người',
      select: 'Tìm kiếm tên người ...',
    },
    note: 'Ghi chú',
  },
  noMatchingPerson: 'Không tìm thấy người phù hợp',
  offsetApplied: 'Bù trừ {{amount}}',
  offsetBreakdownLent: 'Cho vay {{lent}} − Đã vay lại {{borrowed}}',
  offsetBreakdownBorrowed: 'Vay {{borrowed}} − Đã trả lại {{lent}}',
  offsetDetail:
    'Bù trừ {{offsetAmount}} (cho vay {{lent}}, vay lại {{borrowed}}) → còn lại {{net}}',
}

export default debt
