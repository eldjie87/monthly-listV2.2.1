import supabase from '../supabase/supabase.js';

const updateSaldo = async (req, res) => {
    // 1. Ambil saldo lama
    const { data: saldoData, error: errorGet } = await supabase
        .from('saldo')
        .select('saldo')
        .eq('id', 1)
        .single()

    if (errorGet) {
        return res.status(500).json({ error: errorGet.message });
    }

    const saldoLama = saldoData.saldo;
    const saldoBaru = req.body.saldo;
    const saldoAkhir = saldoLama + saldoBaru;

    // 2. Update saldo
    const { data, error } = await supabase
        .from('saldo')
        .update({ saldo: saldoAkhir })
        .eq('id', 1)
        .select()
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }
    res.status(200).json({ message: 'Saldo berhasil diupdate', data });
};

const addSaldo = async (req, res) => {
    const nilaiSaldo = req.body.saldo; // pastikan ini angka
    try {
        const { data, error } = await supabase
            .from('saldo')
            .insert([{ saldo: nilaiSaldo }]);
        if (error) {
            throw error;
        }
        res.status(201).json({ message: 'Saldo berhasil ditambah', data });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

//get saldo
const getSaldo = async (req, res) => {
    const { data, error } = await supabase
        .from('saldo')
        .select('*')
        .eq('id', 1)
        .single();

    if (error) {
        return res.status(500).json({ error: error.message });
    }

    res.status(200).json({ data });
};

export default {
    updateSaldo,
    addSaldo,
    getSaldo
};