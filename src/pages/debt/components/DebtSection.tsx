import { ArrowUpCircle, ArrowDownCircle } from 'lucide-react'
import { Debt, PersonDebtGroup } from '@/types'
import PersonDebtGroupItem from './PersonDebtGroupItem'
import { DebtType, TYPE_LENT } from '../shared'

interface DebtSectionProps {
  title: string
  type: DebtType
  groups: PersonDebtGroup[]
  emptyText: string
  onDelete: (id: string) => void
  onEdit: (debt: Debt) => void
}

export const DebtSection: React.FC<DebtSectionProps> = ({
  title,
  type,
  groups = [],
  emptyText,
  onDelete,
  onEdit,
}) => {
  const icon =
    type === TYPE_LENT ? (
      <ArrowUpCircle className="w-6 h-6 text-green-400" />
    ) : (
      <ArrowDownCircle className="w-6 h-6 text-red-400" />
    )

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        {icon}
        {title}
      </h2>

      <div className="space-y-3">
        {groups.map((group) => (
          <PersonDebtGroupItem
            key={group.personId}
            group={group}
            color={type === TYPE_LENT ? 'green' : 'red'}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}

        {groups.length === 0 && (
          <div className="text-center py-8 bg-slate-800 rounded-xl border border-slate-700">
            <p className="text-slate-400">{emptyText}</p>
          </div>
        )}
      </div>
    </div>
  )
}
