"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Separator } from "@/components/ui/separator";
import { useSession } from "@/clientContext/AuthContext";
import { useEffect, useState } from "react";
import { getBalance, getTransactions } from "@/clientServices/userRequestService";
import { formatMoneyFromCents } from "@/lib/utilities";
import { Transaction, TransactionsResponse } from "@/lib/exportableTypes";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usePayment } from "@/clientContext/PaymentContext";
import { currencyNameP } from "@/lib/importableVariables";

export default function LoggedRoot() {
  const {profile, session} = useSession()
  const {openPayment} = usePayment()
  const [balance, setBalance] = useState<string>('0.00')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function loadStatus() {
      const res = await getBalance(session?.access_token)
      if (!res.error) {
        const bal = res.data?.balance
        setBalance(formatMoneyFromCents(bal?.toString() || ""))
      }
      const Tres = await getTransactions(1, session?.access_token)
      if (!Tres.error) {
        setTransactions(Tres.data?.data || [])
      }
      setLoading(false)
    }

    loadStatus()
  }, [])

    return (
        <div className="select-none p-6">
            <section>
                <h3 className="lg:text-2xl mb-8">Welcome back,
                    <span className="font-bold"> {profile?.displayname}</span>
                </h3>
                
                <p className="text-muted-foreground font-bold lg:text-xl">Balance</p>
                {loading ? <Skeleton className="w-full max-w-200 h-6 lg:h-15 mb-4" /> :
                <h1 className="lg:text-6xl font-bold mb-4">{balance}</h1>}
            </section>
            <Button onClick={()=>openPayment({})} disabled={loading}>
              Send {currencyNameP}
            </Button>
            <Separator className="my-7 w-full" />
            <section>
                <h3 className="text-muted-foreground font-bold lg:text-xl">Recient transactions</h3>
                <TransactionsTable transactions={transactions}/>
            </section>
        </div>
    )
}

function TransactionsTable({transactions}: {transactions: Transaction[]}) {
  const router = useRouter()
  function navigateToProfile(username: string){
    router.push(`/profile/${username}`)
  }
    return (
    <Table>
      <TableCaption>A list of your recent transactions.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction, i) => (
          <TableRow key={i}>
            <TableCell className="font-medium">{transaction.created_at}</TableCell>
            <TableCell 
            className="cursor-pointer"
            onClick={()=>navigateToProfile(transaction.from_username)}>
              @{transaction.from_username}</TableCell>
            <TableCell 
            className="cursor-pointer"
            onClick={()=>navigateToProfile(transaction.to_username)}>
              @{transaction.to_username}</TableCell>
            <TableCell className="text-right">{formatMoneyFromCents(transaction.amount)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}