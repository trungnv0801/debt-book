import type React from 'react'
import { Debt, PersonDebtGroup } from '@/types/debt'
import { useTranslation } from 'react-i18next'
import { DebtSection } from './DebtSection'

interface DebtListProps {
  lentGroups: PersonDebtGroup[]
  borrowedGroups: PersonDebtGroup[]
  handleDeleteDebt: (id: string) => void
  handleEditDebt: (debt: Debt) => void
}

const DebtList: React.FC<DebtListProps> = ({
  lentGroups,
  borrowedGroups,
  handleDeleteDebt,
  handleEditDebt,
}) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <DebtSection
        type="lent"
        title={t('debt.owedToMe')}
        groups={lentGroups}
        emptyText={t('debt.list.noLendTransactions')}
        onDelete={handleDeleteDebt}
        onEdit={handleEditDebt}
      />

      <DebtSection
        type="borrowed"
        title={t('debt.iOwe')}
        groups={borrowedGroups}
        emptyText={t('debt.list.noBorrowTransactions')}
        onDelete={handleDeleteDebt}
        onEdit={handleEditDebt}
      />
    </div>
  )
}

export default DebtList
