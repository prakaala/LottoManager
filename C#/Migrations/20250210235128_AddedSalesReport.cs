using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LottoManager.Migrations
{
    /// <inheritdoc />
    public partial class AddedSalesReport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "SalesReports",
                columns: table => new
                {
                    ReportID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Date = table.Column<DateOnly>(type: "date", nullable: false),
                    GasStationID = table.Column<int>(type: "int", nullable: false),
                    TotalSales = table.Column<int>(type: "int", nullable: false),
                    TotalTicketsSold = table.Column<int>(type: "int", nullable: false),
                    ActivatedTickets = table.Column<int>(type: "int", nullable: false),
                    ConfirmedTickets = table.Column<int>(type: "int", nullable: false),
                    SoldOutPacks = table.Column<int>(type: "int", nullable: false),
                    EmailSent = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SalesReports", x => x.ReportID);
                    table.ForeignKey(
                        name: "FK_SalesReports_GasStations_GasStationID",
                        column: x => x.GasStationID,
                        principalTable: "GasStations",
                        principalColumn: "GasStationID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_SalesReports_GasStationID_Date",
                table: "SalesReports",
                columns: new[] { "GasStationID", "Date" },
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "SalesReports");
        }
    }
}
