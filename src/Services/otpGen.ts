
export const otpGen = ()=>{
    const otpNumber = Math.floor((Math.random() * 10000)+1);
    if (otpNumber > 999 && otpNumber < 10000) {
        return otpNumber;
    }
    otpGen()
}