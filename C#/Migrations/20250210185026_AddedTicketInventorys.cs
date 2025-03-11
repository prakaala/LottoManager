using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LottoManager.Migrations
{
    /// <inheritdoc />
    public partial class AddedTicketInventorys : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "TicketInventorys",
                columns: table => new
                {
                    InventoryID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    GasStationID = table.Column<int>(type: "int", nullable: false),
                    LotteryID = table.Column<int>(type: "int", nullable: false),
                    LotteryName = table.Column<string>(type: "varchar(255)", maxLength: 255, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    GameNumber = table.Column<string>(type: "varchar(10)", maxLength: 10, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PackNumber = table.Column<string>(type: "varchar(20)", maxLength: 20, nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    PackSize = table.Column<int>(type: "int", nullable: false),
                    SlotNumber = table.Column<int>(type: "int", nullable: true),
                    CurrentNumber = table.Column<int>(type: "int", nullable: false),
                    StartNumber = table.Column<int>(type: "int", nullable: false),
                    EndNumber = table.Column<int>(type: "int", nullable: false),
                    TotalSold = table.Column<int>(type: "int", nullable: false),
                    ValueAmount = table.Column<int>(type: "int", nullable: false),
                    ConfirmDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    ActivateDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    SoldOutDate = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    CreateAt = table.Column<DateTime>(type: "datetime(6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TicketInventorys", x => x.InventoryID);
                    table.ForeignKey(
                        name: "FK_TicketInventorys_GasStations_GasStationID",
                        column: x => x.GasStationID,
                        principalTable: "GasStations",
                        principalColumn: "GasStationID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TicketInventorys_Lotterys_LotteryID",
                        column: x => x.LotteryID,
                        principalTable: "Lotterys",
                        principalColumn: "LotteryID",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateIndex(
                name: "IX_TicketInventorys_GasStationID_LotteryID",
                table: "TicketInventorys",
                columns: new[] { "GasStationID", "LotteryID" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_TicketInventorys_LotteryID",
                table: "TicketInventorys",
                column: "LotteryID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "TicketInventorys");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "PasswordHash",
                keyValue: null,
                column: "PasswordHash",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "PasswordHash",
                table: "Users",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");
        }
    }
}
