def transfer_money(from_id, to_id, amount)
  Account.transaction(isolation: :serializable) do
    from_account = Account.find(from_id)
    to_account = Account.find(to_id)
    
    raise InsufficientFundsError if from_account.balance < amount
    
    from_account.update!(balance: from_account.balance - amount)
    to_account.update!(balance: to_account.balance + amount)
    
    Transfer.create!(
      from_account: from_account,
      to_account: to_account,
      amount: amount
    )
  end
end
