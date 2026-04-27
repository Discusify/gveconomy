"use client"
import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { PaymentData, ProfileInformation } from "@/lib/exportableTypes";
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { postTransaction } from "@/clientServices/transactionService";
import * as z from "zod";
import { useSession } from "@/clientContext/AuthContext";
import { getProfile } from "@/clientServices/profileService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatMoneyFromCents, moneyToCents, toCents, formatMoney } from "@/lib/utilities";
import VerifiedBadge from "@/components/ui/verifiedBadge";
import { Separator } from "@/components/ui/separator";

type PaymentContextType = {
    isOpen: boolean;
    paymentData: PaymentData | null;
    openPayment: (data: PaymentData) => void;
    closePayment: () => void;
};

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// 👇 schema
const formSchema = z.object({
    username: z.string().min(1, "Username is required"),
    amount: z
        .number()
        .positive()
        .refine((val) => Number.isInteger(val * 100), {
            message: "Amount must have at most 2 decimal places",
        })
});

type FormValues = z.infer<typeof formSchema>;

export function PaymentProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
    const [confirmProfile, setConfirmProfile] = useState<ProfileInformation | null>(null);
    const [loading, setLoading] = useState(false);
    const { session, profile } = useSession()

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            amount: 0,
        },
    });

    const openPayment = (data: PaymentData) => {
        setPaymentData(data);
        setConfirmProfile(null);
        setIsOpen(true);
    };

    const closePayment = () => {
        setIsOpen(false);
        setConfirmProfile(null);
        setPaymentData(null);
        form.reset();
    };

    // 👇 sincroniza valores cuando abres
    useEffect(() => {
        if (paymentData) {
            form.reset({
                username: paymentData.username ?? "",
                amount: paymentData.amount ?? 0,
            });
        }
    }, [paymentData, form]);

    const handlePayment = async (data: FormValues) => {
        setLoading(true);
        if (confirmProfile) {
            const newAmount = toCents(data.amount.toString());
            console.log("Amount in cents:", newAmount);
            const res = await postTransaction(data.username, newAmount, undefined, session?.access_token);
            if (!res.data?.success) {
                setLoading(false);
                toast.error(res.error || "Payment failed");
                return;
            }
            closePayment();
            setLoading(false);
            toast.success("Payment successful");
        } else {
            if (data.username === profile?.username) {
                setLoading(false);
                toast.error("You cannot pay yourself");
                return;
            }
            const profileResult = await getProfile(data.username, session?.access_token);
            if (profileResult.error || !profileResult.data) {
                setLoading(false);
                toast.error("User not found");
                return;
            }
            setConfirmProfile(profileResult.data);
            await new Promise((resolve) => setTimeout(resolve, 2000)); // small delay for confirmation dialog
            setLoading(false);
        }
    };

    const value = { isOpen, paymentData, openPayment, closePayment };

    return (
        <PaymentContext.Provider value={value}>
            {children}
            <Dialog open={isOpen} onOpenChange={closePayment}>
                <DialogContent className="sm:max-w-sm">
                    {confirmProfile ? (
                        <form onSubmit={form.handleSubmit(handlePayment)}>
                            <div>
                                <DialogHeader className="mb-4">
                                    <DialogTitle>Confirm Payment</DialogTitle>
                                    <DialogDescription>
                                        You are about to pay <strong>{formatMoney(form.getValues("amount"))}</strong> to <strong>{confirmProfile.username}</strong>. Please confirm to proceed.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="flex items-center gap-4">
                                    <Avatar className="w-16 h-16">
                                        <AvatarImage src={confirmProfile.avatar_url} />
                                        <AvatarFallback>{confirmProfile.username.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-bold text-xl">{confirmProfile.displayname}</p>
                                        <div className="flex items-center gap-1">
                                            <p className="text-md text-muted-foreground">@{confirmProfile.username}</p>
                                            {confirmProfile.verified_at && <VerifiedBadge width={12} height={12} />}
                                        </div>
                                    </div>
                                </div>
                                <Separator className="my-4" />
                                <p className="text-2xl font-bold">{formatMoney(form.getValues("amount"))}</p>
                            </div>
                            <DialogFooter className="pt-6">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>

                                <Button type="submit" disabled={loading}>
                                    {loading ? "Processing Shipment" : "Continue"}
                                </Button>
                            </DialogFooter>
                        </form>
                    ) :
                        <form onSubmit={form.handleSubmit(handlePayment)}>
                            <DialogHeader className="mb-4">
                                <DialogTitle>Pay</DialogTitle>
                                <DialogDescription>
                                    Complete the form to proceed with the payment.
                                </DialogDescription>
                            </DialogHeader>

                            <FieldGroup className="space-y-4">

                                {/* USERNAME */}
                                <Controller
                                    name="username"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Username</FieldLabel>
                                            <Input
                                                placeholder="Recipient's username"
                                                {...field}
                                                disabled={!!paymentData?.username}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                                {/* AMOUNT */}
                                <Controller
                                    name="amount"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel>Amount</FieldLabel>
                                            <Input
                                                step="0.01"
                                                type="number"
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                disabled={!!paymentData?.amount}
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />

                            </FieldGroup>
                            <DialogFooter className="pt-6">
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>

                                <Button type="submit" disabled={loading}>
                                    {loading ? "Loading Profile" : "Continue"}
                                </Button>
                            </DialogFooter>
                        </form>}
                </DialogContent>
            </Dialog>
        </PaymentContext.Provider>
    );
}

export function usePayment() {
    const context = useContext(PaymentContext);
    if (!context) {
        throw new Error("usePayment debe usarse dentro de PaymentProvider");
    }
    return context;
}