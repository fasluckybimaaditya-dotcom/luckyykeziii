let data = JSON.parse(localStorage.getItem("penjualan")) || [];
const list = document.getElementById("list");
const grand = document.getElementById("grand");
const totalTransaksi = document.getElementById("totalTransaksi");
const totalPendapatan = document.getElementById("totalPendapatan");
const produkTerjual = document.getElementById("produkTerjual");
let chart;

function save(){
    localStorage.setItem("penjualan", JSON.stringify(data));
}

function tambah(){
    const produk = document.getElementById("produk").value;
    const harga = Number(document.getElementById("harga").value);
    const qty = Number(document.getElementById("qty").value);

    if(!produk || !harga || !qty) return alert("Lengkapi semua data!");

    data.push({produk, harga, qty});
    save();
    render();
}

function hapus(i){
    data.splice(i,1);
    save();
    render();
}

function edit(i){
    let p = prompt("Edit Nama Produk", data[i].produk);
    let h = prompt("Edit Harga", data[i].harga);
    let q = prompt("Edit Qty", data[i].qty);

    if(p && h && q){
        data[i].produk = p;
        data[i].harga = Number(h);
        data[i].qty = Number(q);
        save();
        render();
    }
}

function render(){
    let html="";
    let total = 0;
    let totalQty = 0;

    data.forEach((x,i)=>{
        const t = x.harga * x.qty;
        total += t;
        totalQty += x.qty;

        html += `
            <tr>
                <td>${i+1}</td>
                <td>${x.produk}</td>
                <td>Rp ${x.harga.toLocaleString()}</td>
                <td>${x.qty}</td>
                <td>Rp ${t.toLocaleString()}</td>
                <td>
                    <button onclick="edit(${i})">Edit</button>
                    <button onclick="hapus(${i})" style="background:red">Hapus</button>
                </td>
            </tr>
        `;
    });

    list.innerHTML = html;
    grand.innerText = "Rp " + total.toLocaleString();
    totalTransaksi.innerText = data.length;
    totalPendapatan.innerText = "Rp " + total.toLocaleString();
    produkTerjual.innerText = totalQty;

    renderChart();
}

function renderChart(){
    const ctx = document.getElementById("chart").getContext("2d");
    if(chart) chart.destroy();
    chart = new Chart(ctx,{
        type:"bar",
        data:{
            labels:data.map(x=>x.produk),
            datasets:[{
                label:"Total Penjualan",
                data:data.map(x=>x.harga * x.qty)
            }]
        }
    });
}

function exportCSV(){
    let csv = "Produk,Harga,Qty,Total\n";
    data.forEach(x=>{
        csv += `${x.produk},${x.harga},${x.qty},${x.harga*x.qty}\n`;
    });
    download(csv, "laporan.csv", "text/csv");
}

function exportExcel(){
    let table = "<table><tr><th>Produk</th><th>Harga</th><th>Qty</th><th>Total</th></tr>";
    data.forEach(x=>{
        table += `<tr><td>${x.produk}</td><td>${x.harga}</td><td>${x.qty}</td><td>${x.harga*x.qty}</td></tr>`;
    });
    table += "</table>";
    download(table, "laporan.xls", "application/vnd.ms-excel");
}

function exportPDF(){
    const w = window.open("", "PDF");
    w.document.write("<h1>Laporan Penjualan</h1>" + document.querySelector("table").outerHTML);
    w.print();
}

function download(content, fileName, type){
    const a = document.createElement("a");
    const file = new Blob([content], {type:type});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

document.getElementById("darkToggle").onclick = ()=>{
    document.body.classList.toggle("dark");
};

render();